from utils.multimodal_emotion import analyze_text_emotion, combine_emotions
from utils.music_recommender import get_music_recommendations

print('text(sad)->', analyze_text_emotion('sad'))
print('text(I am sad)->', analyze_text_emotion('I am sad and down'))
print('combine [sad]->', combine_emotions(['sad']))
print('recommend(sad)->', get_music_recommendations('sad', 5))
print('recommend I am sad->', get_music_recommendations('I am sad',5))
