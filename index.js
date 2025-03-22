import cluster from 'cluster';
import os from 'os';
import { config } from 'dotenv';
import createApp from './app.js';

config(); // Load environment variables from .env

const PORT = process.env.PORT || 3000;
const NUM_CPUS = os.cpus().length;
console.log(NUM_CPUS)


if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers for each CPU core
    for (let i = 0; i < NUM_CPUS; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    const app = createApp();

    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
}