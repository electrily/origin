import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import printValue from 'yup/lib/util/printValue';

export const useValidation = () => {
    const { t } = useTranslation();
    const [yupLocaleInitialized, setYupLocaleInitialized] = useState(false);

    function setYupLanguage() {
        const translate = (path: string) => {
            return (values: any) => t(`validations.yup.${path}`, values);
        };
        Yup.setLocale({
            mixed: {
                default: translate('mixed.default'),
                required: translate('mixed.required'),
                oneOf: translate('mixed.oneOf'),
                notOneOf: translate('mixed.notOneOf'),
                notType: ({ path, type, value, originalValue }) => {
                    const isCast = originalValue != null && originalValue !== value;

                    const butValueWas = `${t('validations.yup.mixed.notType.butValueWas', {
                        value: printValue(value, true)
                    })}`;

                    let msg =
                        `${t('validations.yup.mixed.notType.mustBeType', {
                            path,
                            type
                        })} ${butValueWas}` +
                        (isCast
                            ? ` ${t('validations.yup.mixed.notType.castFromTheValue', {
                                  originalValue: printValue(originalValue, true)
                              })}`
                            : '.');

                    if (value === null) {
                        msg += `\n ${t('validations.yup.mixed.notType.ifNull')}`;
                    }

                    return msg;
                }
            },
            string: {
                length: translate('string.length'),
                min: translate('string.min'),
                max: translate('string.max'),
                matches: translate('string.matches'),
                email: translate('string.email'),
                url: translate('string.url'),
                trim: translate('string.trim'),
                lowercase: translate('string.lowercase'),
                uppercase: translate('string.uppercase')
            },
            number: {
                min: translate('number.min'),
                max: translate('number.max'),
                lessThan: translate('number.lessThan'),
                moreThan: translate('number.moreThan'),
                positive: translate('number.positive'),
                negative: translate('number.negative'),
                integer: translate('number.integer')
            }
        });

        setYupLocaleInitialized(true);
    }

    useEffect(() => {
        if (!t || yupLocaleInitialized) {
            return;
        }

        setYupLanguage();
    }, [t, yupLocaleInitialized]);

    return { Yup, yupLocaleInitialized };
};
