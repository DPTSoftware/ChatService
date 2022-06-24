import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";
import { Subject } from "rxjs";
import { ClientModel } from "./client.model";
import { SendModel } from "./send.model";
import { SentModel } from "./sent.model";

@Injectable({ providedIn: "root" })
export class AppChatService {
    $connected = new Subject<ClientModel>();
    $disconnected = new Subject<ClientModel>();
    $listed = new Subject<ClientModel[]>();
    $sent = new Subject<SentModel>();

    private connection!: HubConnection;

    connect() {
        this.connection.start().catch(() => setTimeout(() => this.connect(), 5000));
    }

    send(send: SendModel) {
        return this.connection.invoke("Send", send);
    }

    start(name: string) {
        this.connection = new HubConnectionBuilder().withUrl(`chathub?name=${name}`).build();
        this.connection.on("Connected", (client: ClientModel) => this.$connected.next(client));
        this.connection.on("Disconnected", (client: ClientModel) => this.$disconnected.next(client));
        this.connection.on("Listed", (clients: ClientModel[]) => this.$listed.next(clients));
        this.connection.on("Sent", (sent: SentModel) => this.$sent.next(sent));
        this.connect();
    }
}
