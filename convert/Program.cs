

using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Processors.Transforms;
using System.Text.Json;

var dirs = Directory.GetDirectories(@"..\..\..\..\web");

var stickers = new Dictionary<string, List<string>>();

foreach (var dir in dirs)
{
    var files = Directory.GetFiles(dir);
    var di = new DirectoryInfo(dir);

    var list = new List<string>();
    stickers.Add(di.Name, list);

    var i = 0;
    foreach (var file in files)
    {
        var fi = new FileInfo(file);

        if (!fi.Name.StartsWith("file_"))
        {
            //continue;
        }

        if (fi.Name.Contains("_"))
        {
            fi.Delete();
            continue;
        }

        i++;

        var fileDir = fi.Directory.FullName;
        var uid = $"{i:00}-{Guid.NewGuid():N}";
        var newName = $@"{fileDir}\{uid}.png";

        list.Add(uid);

        fi.MoveTo(newName);

        using var image = Image.Load(newName);
        foreach (var size in new[] { 256, 160, 128, 64, 32 })
        {
            image.Mutate(x => x.Resize(size, 0));
            image.Save($@"{fileDir}\{uid}_{size}.png", new PngEncoder());
        }
    }
}


var jsonString = JsonSerializer.Serialize(stickers);

Console.WriteLine("done");
Console.ReadKey();
