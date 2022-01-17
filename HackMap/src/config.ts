import { ImmutableObject } from 'seamless-immutable';

export interface Config {
  apiKey: string;
  providerURL: string;
  routingTargetsURL: string;
  feedbackURL: string;
  driveSAURL: string;
  walkSAURL: string;
}

export type IMConfig = ImmutableObject<Config>;
