import sys


ffmpegPath = r"C:\ffmpeg\bin\ffmpeg.exe"

ffprobePath = r"C:\ffmpeg\bin\ffprobe.exe"
from converter import Converter
c = Converter(ffmpegPath, ffprobePath)


print(sys.argv[0])
print('Second param:'+sys.argv[1])
filename = sys.argv[1]
filenameconvert = filename.split('.mp4')[0]
# samplerate 44100
info = c.probe('/Service/Datafile/'+filename)
conv = c.convert('/Service/Datafile/'+filename,
                '/Service/Tools/Converter/Fileconvert/'+filenameconvert+'.mp3', {
    'format': 'mp4',
    'audio': {
        'codec': 'mp3',
        'samplerate': 44100, 
        'channels': 2
    },
    'video': {
        'codec': 'h264',
        'width': 1280,
        'height': 720,
        'fps': 30
    }})

for timecode in conv:
    print("Converting (%f) ...\r" % timecode)

print("done")
