import { ImmutableObject } from 'seamless-immutable';

export interface Config {
  apiKey: string;
  providerURL: string;
  routingTargetsURL: string;
  serviceAreaURL: string;
}

export type IMConfig = ImmutableObject<Config>;
