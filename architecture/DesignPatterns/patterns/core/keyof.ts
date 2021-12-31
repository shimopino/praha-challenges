type SignupFormState = {
  name: string;
  email: string;
}

type ActionPayload = {
  key: keyof SignupFormState;
  value: string;
}

const samplePayload: ActionPayload = {
  key: "name",
  value: "shimopino",
};

type actionPayloadKeys = keyof typeof samplePayload;

const key: actionPayloadKeys = "key";
