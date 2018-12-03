export class User {

    constructor(
        public email:      string,
        public password:   string,
        public password2?: string,
        public firstName?: string,
        public lastName?:  string,
        public _id?:       string,
        public avatar?:    string,
    ) { }

    fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

}
