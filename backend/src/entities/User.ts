import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    isVerified: boolean = false;
    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }
}

export default User;