import os
os.environ['FORCE_LOCAL_RECOMMENDER'] = '1'

from utils.music_recommender import get_music_recommendations

if __name__ == '__main__':
    recs = get_music_recommendations('calm piano for studying', 5, return_source=True)
    print('RESULT:')
    print(recs)
