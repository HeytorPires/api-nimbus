import { createConnection } from 'typeorm';
import ormconfig from '../../../../ormconfig';

createConnection(ormconfig as Parameters<typeof createConnection>[0]);
