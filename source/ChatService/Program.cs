using ChatService;
using Microsoft.AspNetCore.SpaServices.AngularCli;

var builder = WebApplication.CreateBuilder();

builder.Services.AddResponseCompression();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddSpaStaticFiles(options => options.RootPath = "Client/dist");
builder.Services.AddSingleton<IChatService, ChatService.ChatService>();

var application = builder.Build();

application.UseDeveloperExceptionPage();
application.UseHsts();
application.UseHttpsRedirection();
application.UseRouting();
application.UseResponseCompression();
application.UseEndpoints(endpoints => endpoints.MapHub<ChatHub>(nameof(ChatHub).ToLower()));
application.UseStaticFiles();
application.UseSpaStaticFiles();

application.UseSpa(builder =>
{
    builder.Options.SourcePath = "Client";
    if (application.Environment.IsDevelopment()) builder.UseAngularCliServer("start");
});

application.Run();
