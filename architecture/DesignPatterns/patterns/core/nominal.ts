class User {
    private static readonly __type: unique symbol = Symbol();
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

type Account = {
    name: string;
}

function printUserName(o: User) {
    console.log(o.name);
}

printUserName(new User('shimopino'));
printUserName({name: 'shimopino'});
