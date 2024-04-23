class Node {
    constructor(state, parent, depth, move) {
        this.state = state;
        this.parent = parent;
        this.depth = depth;
        this.move = move;
    }
}

class PuzzleSolver {
    constructor(goalState) {
        this.goalState = goalState;
    }

    isGoalState(state) {
        return JSON.stringify(state) === JSON.stringify(this.goalState);
    }

    getNeighbors(state) {
        const neighbors = [];
        for (let i = 0; i < state.length; i++) {
            for (let j = 0; j < state[i].length; j++) {
                if (state[i][j] === null) {
                    // move down
                    if (i > 0) {
                        const newState = JSON.parse(JSON.stringify(state));
                        newState[i][j] = newState[i - 1][j];
                        newState[i - 1][j] = null;
                        neighbors.push(new Node(newState, null, 0, { type: 'down', row: i, col: j }));
                    }
                    // move up
                    if (i < state.length - 1) {
                        const newState = JSON.parse(JSON.stringify(state));
                        newState[i][j] = newState[i + 1][j];
                        newState[i + 1][j] = null;
                        neighbors.push(new Node(newState, null, 0, { type: 'up', row: i, col: j }));
                    }
                    // move right
                    if (j > 0) {
                        const newState = JSON.parse(JSON.stringify(state));
                        newState[i][j] = newState[i][j - 1];
                        newState[i][j - 1] = null;
                        neighbors.push(new Node(newState, null, 0, { type: 'right', row: i, col: j }));
                    }
                    // move left
                    if (j < state[i].length - 1) {
                        const newState = JSON.parse(JSON.stringify(state));
                        newState[i][j] = newState[i][j + 1];
                        newState[i][j + 1] = null;
                        neighbors.push(new Node(newState, null, 0, { type: 'left', row: i, col: j }));
                    }
                }
            }
        }
        return neighbors;
    }

    bfs(initialState) {
        const queue = [new Node(initialState, null, 0, null)];
        const visited = new Set();
        let moveCount = 0;


        while (queue.length > 0) {
            const node = queue.shift();
            if (this.isGoalState(node.state)) {
                return this.reconstructPath(node);
            }
            visited.add(JSON.stringify(node.state));
            const neighbors = this.getNeighbors(node.state);
            for (const neighbor of neighbors) {
                if (!visited.has(JSON.stringify(neighbor.state))) {
                    queue.push(new Node(neighbor.state, node, node.depth + 1, neighbor.move));
                    moveCount += 1;
                }
            }
        }
        return null;
    }

    dfs(initialState) {
        const stack = [new Node(initialState, null, 0, null)];
        const visited = new Set();

        while (stack.length > 0) {
            const node = stack.pop();
            if (this.isGoalState(node.state)) {
                return this.reconstructPath(node);
            }
            visited.add(JSON.stringify(node.state));
            const neighbors = this.getNeighbors(node.state);
            for (const neighbor of neighbors) {
                if (!visited.has(JSON.stringify(neighbor.state))) {
                    stack.push(new Node(neighbor.state, node, node.depth + 1, neighbor.move));
                }
            }
        }
        return null;
    }

    reconstructPath(node) {
        const path = [];
        while (node !== null) {
            path.unshift({ state: node.state, move: node.move });
            node = node.parent;
        }
        return path;
    }
}

self.onmessage = function (e) {
    const algorithm = e.data.algorithm;
    const initialState = e.data.initialState;
    const goalState = e.data.goalState;

    const solver = new PuzzleSolver(goalState);

    if (algorithm === 'bfs') {
        const bfsSolution = solver.bfs(initialState);
        self.postMessage(bfsSolution);
    } else if (algorithm === 'dfs') {
        const dfsSolution = solver.dfs(initialState);
        self.postMessage(dfsSolution);
    } else {
        self.postMessage(null);
    }
};