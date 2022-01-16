import { ImmutableObject } from 'seamless-immutable';

export interface Config {
  apiKey: string;
  providerURL: string;
  routingTargetsURL: string;
  feedbackURL: string;
  serviceAreaURL: string;
}

export type IMConfig = ImmutableObject<Config>;
