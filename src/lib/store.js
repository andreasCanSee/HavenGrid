import { writable } from 'svelte/store';

const boardConfig = writable([
    { name: 'Sao Paulo',
        x: 2,
        y: 5,
        connections: ['Lagos', 'Asgard']
    },
    { name: 'Lagos',
        x: 3,
        y: 5,
        connections: ['Sao Paulo', 'Asgard']
    },
    { name: 'Asgard',
        x: 3,
        y: 4,
        connections: ['Sao Paulo', 'Lagos', 'Avalon', 'Atlantis', 'Jacksonville']
    },
    { name: 'Jacksonville',
        x: 2,
        y: 4,
        connections: ['Asgard', 'Washington', 'New York']
    },
    { name: 'Washington',
        x: 1,
        y: 3,
        connections: ['New York', 'Jacksonville']
    },
    { name: 'New York',
        x: 2,
        y: 2,
        connections: ['Washington', 'Jacksonville', 'Atlantis']
    },
    { name: 'Atlantis',
        x: 3,
        y: 2,
        connections: ['New York', 'Asgard', 'Avalon']
    },
    { name: 'Avalon',
        x: 4,
        y: 3,
        connections: ['Atlantis', 'Asgard', 'Istanbul', 'Triplois']
    },
    { name: 'Istanbul',
        x: 5,
        y: 2,
        connections: ['Cairo', 'Avalon']
    },
    { name: 'Cairo',
        x: 5,
        y: 3,
        connections: ['Istanbul', 'Tripolis']
    },
    { name: 'Tripolis',
        x: 5,
        y: 4,
        connections: ['Cairo', 'Avalon']
    },
    { name: 'London',
        x: 3,
        y: 1,
        connections: ['Atlantis']
    }
])

export default boardConfig;