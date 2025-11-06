import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Officer {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column()
    middleName: string;
    @Column()
    idNumber: string;
    @Column()
    email: string;
}
