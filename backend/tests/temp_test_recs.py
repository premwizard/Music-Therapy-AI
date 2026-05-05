from backend.utils.music_recommender import get_music_recommendations


def print_list(name, r):
    print(name)
    for i, x in enumerate(r, 1):
        print(f"{i}. {x.get('artist') or ''} - {x.get('title') or ''}")
    print('')


if __name__ == '__main__':
    print_list('TA happy ->', get_music_recommendations('happy', 5, language='tamil'))
    print_list('TA calm  ->', get_music_recommendations('calm', 5, language='tamil'))
    print_list('EN happy ->', get_music_recommendations('happy', 5, language='english'))
