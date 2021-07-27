using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _accessor;

            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor accessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _accessor = accessor;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(),cancellationToken);

                if (user == null)
                {
                    return null;
                }

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null)
                {
                    return null;
                }

                if (photo.IsMain)
                {
                    Console.WriteLine("Called");
                    return Result<Unit>.Failure("You cannot delete your main photo");
                }

                var result = await _accessor.DeletePhoto(photo.Id);

                if (result == null)
                {
                    return  Result<Unit>.Failure("Problem deleting photo from cloudinary");
                }

                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (success)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                else
                {
                    return  Result<Unit>.Failure("Problem deleting photo from API");
                }
            }
        }   
    }

}