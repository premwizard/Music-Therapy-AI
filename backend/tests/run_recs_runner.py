import sys
from pathlib import Path
ROOT = Path(__file__).parents[1].resolve()
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT.parent))

from backend.utils.music_recommender import get_music_recommendations


def print_list(name, r):
    print(name)
    for i, x in enumerate(r, 1):
        print(f"{i}. {x.get('artist') or ''} - {x.get('title') or ''}")
    print('')


if __name__ == '__main__':
    print_list('TA happy ->', get_music_recommendations('I want some upbeat Tamil music to celebrate', 5, return_source=False, language='tamil'))
    print_list('TA calm  ->', get_music_recommendations('chill, soft tamil songs for studying', 5, return_source=False, language='tamil'))
    print_list('EN happy ->', get_music_recommendations('happy', 5, return_source=False, language='english'))
