import React from 'react';
import PropTypes from 'prop-types';

import {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonRow,
    IonGrid,
    IonCol,
    IonText,
    IonTextarea,    
} from "@ionic/react";

import { validate } from 'validate.js';

type InputValue = string | number | null;

type Color = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark' | undefined;

interface SubmitCallback {
  (submitFields: any) : any;
}

export interface EqualityConstraint
{
  field: string;
  message: string;
}

export interface CallbackTypeCallback {
  (label :string, value: InputValue, onChange: SubmitCallback, style?: any, color?: Color, labelColor?: Color, placeholder?: string | undefined): any;
}

export interface Input
{
  label: string;
  type: any; //'email' | 'password' | 'text' | 'number' | 'textarea' | CallbackTypeCallback;
  field: string;
  value: InputValue;
  onChange(value: any): void;
  messageEmpty?: string;
  equality?: EqualityConstraint;
  placeholder?: string;
  color?: Color;
  labelColor?: Color;
  excludeValues?: InputValue[];
  excludeValuesMessage?: string;
  max?: number;
}

interface FormsProps
{
  inputs: Input[];
  submitLabel: string;
  submitDisabled?: boolean;
  labelStyles?: any;
  inputStyles?: any;
  inputContainerStyles?: any;
  formStyles?: any;
  submitStyles?: any;
  errorStyles?: any;
  submitVisible?: boolean;
  submitColor: Color;
  onSubmit: SubmitCallback;
}

const validateInputFields = (inputs: Input[]): any => {
  const submitFields: any = {};
  const constraints: any = {};

  inputs.forEach(({ type, field, value, messageEmpty, equality, excludeValues, excludeValuesMessage, max }) => {
    const isRequired = typeof(messageEmpty) === 'string';
    submitFields[field] = value;

    constraints[field] = isRequired ? {
      presence: {
        allowEmpty: false,
        message: messageEmpty
      }
    } : {
      presence: false
    };

    if (type === 'email' && value !== '') {
      constraints[field]['email'] = {
        message: 'Your email\'s format is invalid.'
      };
    }

    if (type === 'number' && value !== '' && max !== undefined) {
      constraints[field]['numericality'] = {
        lessThanOrEqualTo: max,
      };
    }

    if (excludeValues?.length) {
      constraints[field]['exclusion'] = {
        within: excludeValues,
        message: excludeValuesMessage,
      };
    }

    if (equality) {
      constraints[field]['equality'] = {
        attribute: equality.field,
        message: equality.message,
      };
    }
  });

  return { submitFields, validatedErrors: validate(submitFields, constraints, { fullMessages: false }) };
}

const Forms = ({
  inputs,
  submitLabel,
  submitDisabled,
  labelStyles,
  inputStyles,
  inputContainerStyles,
  formStyles,
  submitStyles,
  errorStyles,
  submitVisible,
  onSubmit,
  submitColor
} : FormsProps) => {
  const [errors, setErrors] = React.useState<any>({});

  return (
    <form
      style={formStyles}
      onSubmit={(event) => {
        event.preventDefault();
        const { submitFields, validatedErrors } = validateInputFields(inputs);

        setErrors(validatedErrors || {});
        if (!validatedErrors) {
          onSubmit(submitFields);
        }
      }}
    >
      <IonGrid>
        {inputs.map(({ label, type, field, value, placeholder, onChange, color, labelColor }, i) => (
          <IonRow key={i} style={inputContainerStyles}>
            <IonCol>
              <IonItem>
                {
                typeof type === 'function' ? type(label, value, onChange, inputStyles, color, labelColor, placeholder) :
                <>
                <IonLabel color={labelColor} position="floating" style={labelStyles}>{label}</IonLabel>
                  {type === 'textarea' ?
                    <IonTextarea
                      value={typeof value === 'string' ? value : ''}
                      onIonChange={(e) => onChange(e.detail.value!)}
                      style={inputStyles}
                      placeholder={placeholder}
                      color={color}
                    />
                  :
                    <IonInput
                      type={type}
                      value={value}
                      onIonChange={(e) => onChange(e.detail.value!)}
                      style={inputStyles}
                      placeholder={placeholder}
                      color={color}
                    />}
                  </>
                }
              </IonItem>
              {errors[field] && <IonText style={errorStyles} color='danger'>{errors[field]}</IonText>}
            </IonCol>
          </IonRow>
        ))}
        {submitVisible &&
        <IonRow>
          <IonCol>
            <IonButton color={submitColor} style={submitStyles} disabled={submitDisabled} expand="block" type='submit'>{submitLabel}</IonButton>
          </IonCol>
        </IonRow>}
      </IonGrid>
    </form>
  );
}

Forms.propTypes = {
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
      ]).isRequired,
      field: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      onChange: PropTypes.func.isRequired,
      messageEmpty: PropTypes.string,
      equality: PropTypes.shape({
        field: PropTypes.string,
        message: PropTypes.string,
      }),
      placeholder: PropTypes.string,
      color: PropTypes.string,
      labelColor: PropTypes.string,
    })
  ).isRequired,
  submitLabel: PropTypes.string.isRequired,
  submitDisabled: PropTypes.bool,
  labelStyles: PropTypes.any,
  inputStyles: PropTypes.any,
  inputContainerStyles: PropTypes.any,
  formStyles: PropTypes.any,
  submitStyles: PropTypes.any,
  errorStyles: PropTypes.any,
  submitVisible: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  submitColor: PropTypes.string,
  excludeValues: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  ),
  excludeValuesMessage: PropTypes.string,
  max: PropTypes.number,
};

Forms.defaultProps = {
  submitDisabled: false,
  labelStyles: undefined,
  inputStyles: undefined,
  formStyles: undefined,
  submitStyles: undefined,
  errorStyles: undefined,
  submitVisible: true,
  submitColor: 'primary',
  excludeValues: [],
  excludeValuesMessage: undefined,
  max: undefined,
}

export default Forms;