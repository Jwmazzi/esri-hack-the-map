import { ImmutableObject } from 'seamless-immutable'

export interface Config {
  providerURL: string
}

export type IMConfig = ImmutableObject<Config>
