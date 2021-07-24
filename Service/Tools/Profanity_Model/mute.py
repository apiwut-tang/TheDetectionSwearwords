import ffmpeg
import sys

start = 2.1
end = 2.7

wordlist = [("hello","2.1","2.7"),
        ("fuck","5.0","5.4"),
        ("little","12.6","13.0"),
        ("bitch","19.0","19.7")
    ]
number = [1,2,3,4,5]
def decode_audio2(filename):
        ( 
            ffmpeg
            .input(filename)
            .filter('volume',enable='between(t,{},{})'.format(start,end),volume=0)
            .output("data/output.wav")
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )

decode_audio2("Arm2.mp4")
# print("start : {} end : {}".format(start,end))