1.npm start project-swearwords 
2.npm start Service
3.SET API Envoronment : environment
  3.1 $env:GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"
  3.2 set GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"
4.enable API google cloud platfrom speech to text
5.enable cloud storage
run : http://localhost:8080/Test
--------------------------------------------------
DOC
pip install --upgrade google-api-python-client
pip install google-cloud    
pip install google-cloud-vision
pip install google-cloud-speech
npm install --save @google-cloud/speech

doc url = https://cloud.google.com/speech-to-text/docs/libraries#windows

doc name google error = https://newbedev.com/importerror-no-module-named-google