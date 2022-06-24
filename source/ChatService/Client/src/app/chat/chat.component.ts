import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppChatService } from "./chat.service";
import { ClientModel } from "./client.model";
import { SendModel } from "./send.model";
import { SentModel } from "./sent.model";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AppChatComponent {
    clients = new Array<ClientModel>();
    form = inject(FormBuilder).group({ connectionId: "", message: "", private: false });
    name = Math.random().toString(36).substring(2);

    constructor(private readonly appChatService: AppChatService) {
        this.appChatService.start(this.name);
        this.appChatService.$connected.subscribe((client: ClientModel) => this.connected(client));
        this.appChatService.$disconnected.subscribe((client: ClientModel) => this.disconnected(client));
        this.appChatService.$listed.subscribe((clients: ClientModel[]) => this.listed(clients));
        this.appChatService.$sent.subscribe((sent: SentModel) => this.sent(sent));
    }

    send() {
        this.appChatService.send(this.form.value as SendModel).then(() => this.form.controls.message.reset());
    }

    private addMessage(message: string, css: string) {
        const messages = (document.getElementById("messages") as HTMLElement);
        messages.innerHTML += `<li class="${css}">${message}</li>`;
        messages.scrollTop = messages.scrollHeight;
    }

    private connected(client: ClientModel) {
        this.clients.push(client);
        this.addMessage(`${this.htmlName(client.name)} connected.`, "alert-success");
    }

    private disconnected(client: ClientModel) {
        this.clients = this.clients.filter(item => item.connectionId !== client.connectionId);
        this.addMessage(`${this.htmlName(client.name)} disconnected.`, "alert-danger");
    }

    private htmlName(name: string) {
        return `<span class="name">${name}</span>`;
    }

    private listed(clients: ClientModel[]) {
        this.clients = clients;
    }

    private sent(sent: SentModel) {
        if (!sent.target) {
            this.addMessage(`${this.htmlName(sent.source.name)}: ${sent.message}`, "alert-default");
            return;
        }

        const message = `${this.htmlName(sent.source.name)} to ${this.htmlName(sent.target.name)}: ${sent.message}`;

        if (sent.target.name !== this.name) {
            this.addMessage(`${message}`, "alert-default");
            return;
        }

        this.addMessage(`${message}`, "alert-primary");
    }
}
