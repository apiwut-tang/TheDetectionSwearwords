
from __future__ import unicode_literals, print_function
from google.cloud import speech
from google.cloud import storage
import ffmpeg
import sys
import argparse
import io
import datetime
from profanity_check import predict, predict_prob 

googlepath = ('gs://tangstorage_bucket/Segment_1.wav')
pathconvert2 = ('/Service/Datafile/converter/TEST2.wav')
pathvideo = ('/Service/Datafile/1616555754476_segment1.mp4')
# wordlist = [("hello","0.1","0.10"),
#         ("fuck","0.12","0.15"),
#         ("little","0.20","0.26"),
#         ("bitch","0.11","0.35")
#     ]
wordlist = []
start_time = []
end_time = []

def transcribe_file_with_word_time_offsets(speech_file):
    """Transcribe the given audio file synchronously and output the word time
    offsets."""
    client = speech.SpeechClient()

    with io.open(speech_file, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code="en-US",
        enable_word_time_offsets=True,
    )

    response = client.recognize(config=config, audio=audio)

    for result in response.results:
        alternative = result.alternatives[0]
        print("Transcript: {}".format(alternative.transcript))
        for word_info in alternative.words:
            word = word_info.word
            start_time = word_info.start_time
            end_time = word_info.end_time
            print(
                f"Word: {word}, start_time: {start_time.total_seconds()}, end_time: {end_time.total_seconds()}"
            )
            wordlist.append((word,start_time.total_seconds(),end_time.total_seconds()))
            
# [START speech_transcribe_async_word_time_offsets_gcs]
def transcribe_gcs_with_word_time_offsets(gcs_uri):
    """Transcribe the given audio file asynchronously and output the word time
    offsets."""
    from google.cloud import speech

    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(uri=gcs_uri)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code="en-US",
        enable_word_time_offsets=True,
    )

    operation = client.long_running_recognize(config=config, audio=audio)

    print("Waiting for operation to complete...")
    result = operation.result(timeout=90)

    for result in result.results:
        alternative = result.alternatives[0]
        print("Transcript: {}".format(alternative.transcript))
        print("Confidence: {}".format(alternative.confidence))

        for word_info in alternative.words:
            word = word_info.word
            start_time = word_info.start_time
            end_time = word_info.end_time
            print(
                f"Word: {word}, start_time: {start_time.total_seconds()}, end_time: {end_time.total_seconds()}"
            )
            wordlist.append((word,start_time.total_seconds(),end_time.total_seconds()))
                       

# [END speech_transcribe_async_word_time_offsets_gcs]

def Model(wordlist):
    rude_word = []
    print(wordlist)
    for i in range(len(wordlist)):
        rude_word.append(wordlist[i][0])
    Detect = predict(rude_word)
    for index, e in enumerate(Detect):
        if e==1:
           print(wordlist[index])
           start_time.append(wordlist[index][1])
           end_time.append(wordlist[index][2])

def mute_audio(in_filename,out_filename):
    try:
        stream = ffmpeg.input(in_filename)
        audio = stream.audio
        for index,value in enumerate(start_time):
            audio = ffmpeg.filter(audio, 'volume',enable='between(t,{},{})'.format(start_time[index],end_time[index]),volume=0)
        video = stream.video
        out = ffmpeg.output(audio, video, out_filename)
        ffmpeg.run(out)
    except ffmpeg.Error as e:
        print(e.stderr, file=sys.stderr)
        sys.exit(1)
    return out


if __name__ == "__main__":
    # transcribe_file_with_word_time_offsets(pathconvert2) #function speech
    transcribe_gcs_with_word_time_offsets(googlepath)
    result = Model(wordlist)
    print(start_time)
    print(end_time)
    # mute_audio(pathvideo,"C:/Work/ProjectSoundEnglish/preview/Segment_1.mp4")
    # try:
    #     transcribe_file_with_word_time_offsets(pathconvert2) #function speech
    # except Exception as e:
    #     print ('Handing error: ', e)
        

