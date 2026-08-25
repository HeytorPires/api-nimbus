import { TestAgent } from './auth';
import { connection } from '../setup/database';

export const defaultProject = {
  title: 'Nimbus API',
  description: 'Projeto de integração',
  variablesEnvironment: 'DB_HOST=localhost\nDB_PASS=super-secret',
};

let projectCounter = 0;

export async function createProject(
  agent: TestAgent,
  overrides: Partial<typeof defaultProject> & { tagId?: string } = {}
) {
  projectCounter += 1;

  const payload = {
    ...defaultProject,
    title: `${defaultProject.title} ${projectCounter}`,
    ...overrides,
  };
  const response = await agent.post('/projects').send(payload);

  return { response, payload };
}

/**
 * Colunas cruas do projeto no banco — usadas para provar que
 * `variablesEnvironment` é persistido cifrado, junto do IV.
 */
export async function rawProject(
  id: string
): Promise<{ variablesEnvironment: string; initializationVector: string }> {
  const [row] = await connection().query(
    `SELECT variables_environment AS "variablesEnvironment",
            initialization_vector AS "initializationVector"
       FROM projects WHERE id = $1`,
    [id]
  );

  return row;
}
