/*

    import!!!!!!!!!!

    class User {

        static async register() {
            INSERT INTO users BLAH

            ALSO GOING TO HAVE TO DO BCRYPT STUFF IN HERE
            
            return {user: user}
        }

        static async login() {

        }

        static async all() {
            SELECT username, first_name, last_name, email
            FROM users;
            return {users: [{username, first_name, last_name, email}, ...]}
        }

        static async get() {
            SELECT username, first_name, last_name, email, photo_url
            FROM users
            WHERE username=BLAH;
            return {user: {username, first_name, last_name, email, photo_url}}
        }

        static async update() {
            UPDATE blah blah blah
            return {user: {username, first_name, last_name, email, photo_url}}
        }

        static async remove() {
            DELETE FROM users WHERE username=BLAH;
            return {message: "User deleted"}
        }
    }

*/