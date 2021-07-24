

"""Google Cloud Speech API sample that demonstrates word time offsets.

Example usage:
    python transcribe_word_time_offsets.py resources/audio.raw
    python transcribe_word_time_offsets.py \
        gs://cloud-samples-tests/speech/vr.flac
"""
from __future__ import unicode_literals, print_function
from google.cloud import speech
from google.cloud import storage
import ffmpeg
import sys
import argparse
import io
import datetime
from profanity_check import predict, predict_prob
import json

# print(sys.argv[0])
# print('Second param:'+sys.argv[1])
filename = sys.argv[1]
filenameconvert = filename.split('.mp4')[0]
path = ('././Datafile/'+filename)
pathconvert = ('././Datafile/converter/'+filenameconvert+'.wav')
path_output = ('././Datafile/mute/'+filename)
pathtext = ('././Datafile/Datatext/'+filenameconvert+'.txt')
pathtext2 = ('././Datafile/Datatext/'+filenameconvert+'_Sentence'+'.txt')


filepath = "../../Datafile/Datatext/Data_Text.txt"

wordlist = []
start_time = []
end_time = []
jsonOutput = {
    "output": "",
    "word": [],
    "pathoutput": ""
}

def function_write(data_word,start_time,end_time):
    #d = datetime.datetime.now().microsecond
    #file_name = "Text_" + str(d) + ".txt" 
    f = open(pathtext,"a+")
    f.write(data_word)
    f.write(", ")
    f.write(start_time)
    f.write(", ")
    f.write(end_time)
    f.write("\n")
    f.close()

def function_write_sentence(sentence):
    f = open(pathtext2,"a+")
    f.write(sentence)
    f.write("\n")
    f.close()


def decode_audio(filename):
    try:
        out, err = ( ffmpeg
            .input(filename)
            .output(pathconvert, format='wav', acodec='pcm_s16le', ac=1, ar='44100')
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )
    except ffmpeg.Error as e:
        # print(e.stderr, file=sys.stderr)
        sys.exit(1)
    return pathconvert

def upload_blob(source_file_name):
    """Uploads a file to the bucket."""
    bucket_name = "tangstorage_bucket"
    # source_file_name = "tangstorage_bucket/Datasets"
    destination_blob_name = 'Datasets/'+filenameconvert+'.wav'
    path_gcs = 'gs://tangstorage_bucket/Datasets/'+filenameconvert+'.wav'
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    # print(
    #     "File {} uploaded to {}.".format(
    #         source_file_name, destination_blob_name
    #     )
    # )
    return path_gcs 




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
        # print("Transcript: {}".format(alternative.transcript))
        function_write_sentence(alternative.transcript)
        for word_info in alternative.words:
            word = word_info.word
            start_time = word_info.start_time
            end_time = word_info.end_time
            # print(
            #     f"Word: {word}, start_time: {start_time.total_seconds()}, end_time: {end_time.total_seconds()}"
            # )
            wordlist.append((word,start_time.total_seconds(),end_time.total_seconds()))
            # s = str(start_time.total_seconds())
            # e = str(end_time.total_seconds())
            # function_write(word,s,e)
            
def Speech_GCS_stroage(gcs_uri):
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

    # print("Waiting for operation to complete...")
    result = operation.result(timeout=90)

    for result in result.results:
        alternative = result.alternatives[0]
        # print("Transcript: {}".format(alternative.transcript))
        # print("Confidence: {}".format(alternative.confidence))
        function_write_sentence(alternative.transcript)
        for word_info in alternative.words:
            word = word_info.word
            start_time = word_info.start_time
            end_time = word_info.end_time
            # print(
            #     f"Word: {word}, start_time: {start_time.total_seconds()}, end_time: {end_time.total_seconds()}"
            # )
            wordlist.append((word,start_time.total_seconds(),end_time.total_seconds())) # extract word in listarray_tuple
                       


def Model(wordlist):
    rude_word = []
    for i in range(len(wordlist)):
        rude_word.append(wordlist[i][0])
    Detect = predict(rude_word)
    for index, e in enumerate(Detect):
        if e==1:
           jsonOutput['word'].append(wordlist[index])
           start_time.append(wordlist[index][1])
           end_time.append(wordlist[index][2])

def mute_audio(in_filename,out_filename):
    try:
        stream = ffmpeg.input(in_filename)
        audio = stream.audio
        for index,value in enumerate(start_time):
            audio = ffmpeg.filter(audio, 'volume',enable='between(t,{},{})'.format(start_time[index],end_time[index]),volume=0)
        video = stream.video
        output = ffmpeg.output(audio, video, out_filename)
        out, err = ffmpeg.run(output,capture_stdout=True, capture_stderr=True)
    except ffmpeg.Error as e:
        # print(e.stderr, file=sys.stderr)
        sys.exit(1)
    return out_filename


if __name__ == "__main__":
    try:
        path_audio_data = decode_audio(path) #funcion convert
        path_gcs = upload_blob(path_audio_data) #upload to GCS
        Speech_GCS_stroage(path_gcs)  #speech gcs more 1 min
        # transcribe_file_with_word_time_offsets(path_audio_data) #function speech stroage in device
        result = Model(wordlist) #model find rudeword
        output = mute_audio(path,path_output)
        jsonOutput['output'] = output
        jsonOutput['pathoutput'] = filename
        print(json.dumps(jsonOutput))
    except Exception as e:
        print ('Handing error: ', e)
        


