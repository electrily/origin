// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./Registry.sol";

contract Issuer is Initializable, OwnableUpgradeable {
    event CertificationRequested(address indexed _owner, uint256 indexed _id, string indexed _deviceId);
    event CertificationRequestApproved(address indexed _owner, uint256 indexed _id, uint256 indexed _certificateId);
    event CertificationRequestRevoked(address indexed _owner, uint256 indexed _id);

    event CertificateRevoked(uint256 indexed _certificateId);

    int public certificateTopic;
    Registry public registry;

    mapping(uint256 => CertificationRequest) private certificationRequests;
    mapping(uint256 => uint256) private requestToCertificate;

    uint256 private certificationRequestNonce;

    mapping(uint256 => bool) private revokedCertificates;

    struct CertificationRequest {
        address owner;
        bytes data;
        bool approved;
        bool revoked;
        bool isPrivate;
        address sender;
    }

    function initialize(int _certificateTopic, address _registry, address _owner) public initializer {
        require(_registry != address(0), "initialize: Cannot use address 0x0 as registry address.");
        require(_owner != address(0), "initialize: Cannot use address 0x0 as the owner.");

        certificateTopic = _certificateTopic;

        registry = Registry(_registry);
    }

	/*
		Certification requests
	*/

    function getCertificationRequest(uint256 _requestId) public view returns (CertificationRequest memory) {
        return certificationRequests[_requestId];
    }

    function requestCertificationFor(bytes memory _data, address _owner, bool _private) public returns (uint256) {
        uint256 id = ++certificationRequestNonce;

        certificationRequests[id] = CertificationRequest({
            owner: _owner,
            data: _data,
            approved: false,
            revoked: false,
            isPrivate: _private,
            sender: msg.sender
        });

        (,, string memory deviceId) = decodeData(_data);

        emit CertificationRequested(_owner, id, deviceId);

        return id;
    }

    function requestCertification(bytes calldata _data, bool _private) external {
        requestCertificationFor(_data, msg.sender, _private);
    }

    function isRequestValid(uint256 _requestId) external view returns (bool) {
        CertificationRequest memory request = certificationRequests[_requestId];
        uint certificateId = requestToCertificate[_requestId];

        return _requestId <= certificationRequestNonce
            && request.approved
            && !request.revoked
            && !revokedCertificates[certificateId];
    }

    function revokeRequest(uint256 _requestId) external {
        CertificationRequest storage request = certificationRequests[_requestId];

        require(msg.sender == request.owner || msg.sender == OwnableUpgradeable.owner(), "revokeRequest(): Only the request creator can revoke the request.");
        require(!request.revoked, "revokeRequest(): Already revoked");
        require(!request.approved, "revokeRequest(): You can't revoke approved requests");

        request.revoked = true;

        emit CertificationRequestRevoked(request.owner, _requestId);
    }

    function revokeCertificate(uint256 _certificateId) external onlyOwner {
        require(!revokedCertificates[_certificateId], "revokeCertificate(): Already revoked");
        revokedCertificates[_certificateId] = true;

        emit CertificateRevoked(_certificateId);
    }

    function approveCertificationRequest(
        uint256 _requestId,
        uint256 _value,
        bytes memory _validityData
    ) public onlyOwner returns (uint256) {
        require(_requestNotApprovedOrRevoked(_requestId), "approveCertificationRequest(): request already approved or revoked");

        CertificationRequest memory request = certificationRequests[_requestId];
        require(!request.isPrivate, "CertificationRequest(): please use commitments for private certification");

        _approve(_requestId);

        uint256 certificateId = registry.issue(request.owner, _validityData, certificateTopic, _value, request.data);
        requestToCertificate[_requestId] = certificateId;

        emit CertificationRequestApproved(request.owner, _requestId, certificateId);

        return certificateId;
    }

    function issue(address _to, uint256 _value, bytes memory _data) public onlyOwner returns (uint256) {
        uint256 requestId = requestCertificationFor(_data, _to, false);

        return approveCertificationRequest(
            requestId,
            _value,
            abi.encodeWithSignature("isRequestValid(uint256)", requestId)
        );
    }

	/*
		Utils
	*/

	function encodeData(uint _from, uint _to, string memory _deviceId) public pure returns (bytes memory) {
		return abi.encode(_from, _to, _deviceId);
	}

	function decodeData(bytes memory _data) public pure returns (uint, uint, string memory) {
		return abi.decode(_data, (uint, uint, string));
	}

	/*
		Info
	*/

    function getRegistryAddress() external view returns (address) {
        return address(registry);
    }

    function version() external pure returns (string memory) {
        return "v0.1";
    }

	/*
		Private methods
	*/

    function _approve(uint256 _requestId) private {
        CertificationRequest storage request = certificationRequests[_requestId];
        require(!request.approved, "Already issued"); //consider checking topic and other params from request

        request.approved = true;
    }

    function _requestNotApprovedOrRevoked(uint256 _requestId) private view returns (bool) {
        CertificationRequest memory request = certificationRequests[_requestId];

        return !request.approved && !request.revoked;
    }


	/*
		Utils
	*/

	function encodeClaimData(
		string memory _beneficiary,
		string memory _address,
		string memory _region,
		string memory _zipCode,
		string memory _countryCode
	) public pure returns (bytes memory _claimData) {
		return abi.encode(_beneficiary, _address, _region, _zipCode, _countryCode);
	}

	function decodeClaimData(bytes memory _claimData) public pure returns (
		string memory _beneficiary,
		string memory _address,
		string memory _region,
		string memory _zipCode,
		string memory _countryCode
	) {
		return abi.decode(_claimData, (string, string, string, string, string));
	}
}