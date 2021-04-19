/*
 * Generated by orval v5.0.0-alpha.9 🍺
 * Do not edit manually.
 * Exchange I-REC API
 * Swagger documentation for the Exchange I-REC API
 * OpenAPI spec version: 0.1
 */
import { useMutation, UseMutationOptions } from 'react-query';
import type { OrderBookDTO, ProductFilterDTO } from './exchangeIRECAPI.schemas';
import { customMutator } from '../mutator/custom-mutator';

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export const orderBookControllerGetByProduct = <Data = unknown>(
  productFilterDTO: ProductFilterDTO
) => {
  return customMutator<Data extends unknown ? OrderBookDTO : Data>({
    url: `/api/orderbook/search`,
    method: 'post',
    data: productFilterDTO,
  });
};

export const useOrderBookControllerGetByProduct = <
  Data extends unknown = unknown,
  Error extends unknown = unknown
>(
  mutationConfig?: UseMutationOptions<
    AsyncReturnType<typeof orderBookControllerGetByProduct>,
    Error,
    { data: ProductFilterDTO }
  >
) => {
  return useMutation<
    AsyncReturnType<typeof orderBookControllerGetByProduct>,
    Error,
    { data: ProductFilterDTO }
  >((props) => {
    const { data } = props || {};

    return orderBookControllerGetByProduct<Data>(data);
  }, mutationConfig);
};
export const orderBookControllerGetByProductPublic = <Data = unknown>(
  productFilterDTO: ProductFilterDTO
) => {
  return customMutator<Data extends unknown ? OrderBookDTO : Data>({
    url: `/api/orderbook/public/search`,
    method: 'post',
    data: productFilterDTO,
  });
};

export const useOrderBookControllerGetByProductPublic = <
  Data extends unknown = unknown,
  Error extends unknown = unknown
>(
  mutationConfig?: UseMutationOptions<
    AsyncReturnType<typeof orderBookControllerGetByProductPublic>,
    Error,
    { data: ProductFilterDTO }
  >
) => {
  return useMutation<
    AsyncReturnType<typeof orderBookControllerGetByProductPublic>,
    Error,
    { data: ProductFilterDTO }
  >((props) => {
    const { data } = props || {};

    return orderBookControllerGetByProductPublic<Data>(data);
  }, mutationConfig);
};
