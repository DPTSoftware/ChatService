import { ClientModel } from "./client.model";

export class SentModel {
    message!: string;
    private!: boolean;
    source!: ClientModel;
    target!: ClientModel;
}
