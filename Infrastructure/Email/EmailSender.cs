using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email
{
    public class EmailSender
    {
        private readonly IConfiguration _configuration;

        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string email, string subject, string msg)
        {
            var client = new SendGridClient(_configuration["SendGrid:Key"]);
            var message = new SendGridMessage()
            {
                From = new EmailAddress("nickglas@hotmail.nl", _configuration["SendGrid:User"]),
                Subject = subject,
                PlainTextContent = msg,
                HtmlContent = msg
            };
            message.AddTo(new EmailAddress(email));
            message.SetClickTracking(false,false);
            await client.SendEmailAsync(message);
        }
        
    }
}