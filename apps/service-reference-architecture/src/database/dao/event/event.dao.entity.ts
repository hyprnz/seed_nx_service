import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'event' })
export class EventEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @CreateDateColumn()
    public createdAt!: Date;

    @Column({ type: 'text' })
    public subject!: string;

    @Column({ type: 'text' })
    public subjectName!: string;

    @Column({ type: 'text' })
    public name!: string;

    @Column({ type: 'text' })
    public description!: string;
}
