import sys
import ffmpeg

print(sys.argv[0])
print('Second param:'+sys.argv[1])
filename = sys.argv[1]
filenameconvert = filename.split('.mp4')[0]

(
    ffmpeg
    .input('/Service/Datafile/'+filename)
    .output('/Service/Datafile/converter/'+filenameconvert+'.wav', format='wav', acodec='pcm_s16le', ac=1, ar='44100')
    .run()
)


