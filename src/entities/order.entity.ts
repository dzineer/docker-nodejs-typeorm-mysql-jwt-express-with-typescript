import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn,
    ManyToMany,
    CreateDateColumn, OneToMany
} from "typeorm";
import {User} from "./user.entity";
import {Product} from "./product.entity";
import {OrderItem} from "./order-item.entity";
import {Link} from "./link.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    transaction_id: string;

    @Column()
    user_id: number;

    @Column()
    code: string;

    @Column()
    ambassador_email: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column({ nullable: true})
    address: string;

    @Column({ nullable: true})
    city: string;

    @Column({ nullable: true})
    zip: string;

    @Column({ nullable: true})
    country: string;

    @Column({ default: false})
    complete: boolean;

    @CreateDateColumn()
    created_at: string;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    order_items: OrderItem[];

    @ManyToOne(() => Link, link => link.orders, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({
        referencedColumnName: 'code',
        name: 'code'
    })
    link: Link;

    get name(): string{
        return this.first_name + ' ' + this.last_name;
    }

    get total(): number{
        return this.order_items.reduce((sum: number, item: OrderItem) => sum + item.admin_revenue, 0)
    }

    get ambassador_revenue(): number{
        return this.order_items.reduce((sum: number, item: OrderItem) => sum + item.ambassador_revenue, 0)
    }
}