import { EnvVariable } from '../implementations/EnvConfigProvider';

export interface IEnvConfigProvider {
  get(name: EnvVariable): string | undefined;
  validate(): void;
}
