import index from '../index.js';

const port = 3308;

index().listen(port, () => {
    console.log(`servers started on port ${port}`);
})