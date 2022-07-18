

using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Processors.Transforms;
using System.Text.Json;
using System.Text.RegularExpressions;

var dirs = Directory.GetDirectories(@"..\..\..\..\web");

var stickers = new Dictionary<string, List<string>>();

var rex = new Regex(@"([0-9]{2,3})-(.*?)(_([0-9]{2,3}))?\.png", RegexOptions.Compiled | RegexOptions.IgnoreCase);
var sizes = new[] { 256, 160, 128, 64, 32 };

foreach (var dir in dirs)
{
    var di = new DirectoryInfo(dir);

    var list = new List<string>();
    stickers.Add(di.Name, list);

    var pngDir = Path.Combine(dir, "png");

    var files = Directory.GetFiles(dir).ToList();

    if (Directory.Exists(pngDir))
    {
        files.AddRange(Directory.GetFiles(pngDir));
    }

    var i = 0;
    foreach (var file in files)
    {
        var fi = new FileInfo(file);

        if (fi.Name.EndsWith(".tgs"))
        {
            Console.WriteLine($"deleting {fi.Name}");
            fi.Delete();
            continue;
        }

        string uid = null!;

        var matches = rex.Matches(fi.Name);

        if (matches.Count == 1 && matches[0].Groups[4].Success)
        {
            Console.WriteLine($"skipping {fi.Name}");
            continue;
        }


        string fullName = null!;
        var fileDir = di.FullName;
        i++;

        // if the file exists, parse the id
        if (matches.Count == 1 && matches[0].Groups[1].Success && matches[0].Groups[2].Success)
        {
            var match = matches[0];
            var possibleUid = match.Groups[2].Value;
            if (Guid.TryParse(possibleUid, out var guid))
            {
                Console.WriteLine($"existing {fi.Name}");
    
                uid = $"{match.Groups[1].Value}-{guid:N}";
                fullName = $@"{fileDir}\{uid}.png";
            }
        }

        // if the parsing failed or file didn't exist, pretend it's a new one
        if (uid == null)
        {
            var oldName = fi.Name;
            uid = $"{i:000}-{Guid.NewGuid():N}";
            var newName = $"{uid}.png";
            fullName = $@"{fileDir}\{newName}";
            fi.MoveTo(fullName);

            Console.WriteLine($"new {oldName} -> {newName}");
        }

        list.Add(uid);

        var fileName = Path.GetFileNameWithoutExtension(fullName);
        using var image = Image.Load(fullName);
        foreach (var size in sizes)
        {
            var resizedName = $"{fileName}_{size}.png";
            var resizedFullName = $@"{fileDir}\{resizedName}";

            if (File.Exists(resizedFullName))
            {
                continue;
            }

            Console.WriteLine($"resizing to {size} -> {resizedName}");

            image.Mutate(x => x.Resize(size, 0));
            image.Save(resizedFullName, new PngEncoder());
        }
    }

    if (Directory.Exists(pngDir))
    {
        Directory.Delete(pngDir, true);
    }
}


var jsonString = JsonSerializer.Serialize(stickers);

File.WriteAllText(@"..\..\..\..\web\stickers.json", jsonString);
Console.WriteLine("done");
Console.ReadKey();
