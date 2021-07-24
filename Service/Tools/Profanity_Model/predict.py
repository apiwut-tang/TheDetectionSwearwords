from profanity_check import predict, predict_prob 

# texts = [
#     'bich',
#     'holy shit',
#     'bitch',
#     'holyshit',
#     'you'
#     ]
texts = [
    'there, how are you',
    'Click what do you want man man man man',
    'Go to hell mother fucker',
    'if you want i will show you',
    'i want you to show something',
    'Holy Shit',
    'Screw up',
    'Go jerk yourself'
]    
# print(texts)
result = predict(texts)
result2 = predict_prob(texts)
print(result)
print(result2)