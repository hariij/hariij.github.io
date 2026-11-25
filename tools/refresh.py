#!/usr/bin/env python3
"""hariprav.in · refresh.py: rebuild data.json from live public sources, so the site's facts never go stale.

    python3 tools/refresh.py            (run from the site folder)

What it reads:
  YouTube playlist feeds (no key needed): the #TiffinPsychology plates, the Paavam AI episodes, the latest uploads
  Medium's feed: the latest essays
  The channel's subscriber and video counts: the YouTube Data API if YT_API_KEY is set (the reliable way, free),
  otherwise the public channel page (works today, but YouTube can change that page at any time)

If a source fails, the last good value in data.json is kept and the failure is listed under "problems".
On the real site a scheduled GitHub Action runs this once a day and commits data.json; nobody has to remember.
The years in technology are not stored at all: the page counts them from the year 2000.
"""
import datetime
import html
import json
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, 'data.json')
CHANNEL = 'UCe0-wSvYHMLaEaqTcGiaajg'
HANDLE = 'HariPravinOfficial'
PLAYLISTS = {'tiffin': 'PLYvCRsDYNmBY', 'paavam': 'PLLc3niEuL9sE'}
MEDIUM = 'https://haripravin.medium.com/feed'
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36', 'Accept-Language': 'en'}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=25).read().decode('utf-8', 'replace')


def yt_feed(url):
    out = []
    for e in re.findall(r'<entry>(.*?)</entry>', get(url), re.S):
        g = lambda p: (re.search(p, e, re.S) or [None, ''])[1]
        out.append({'id': g(r'<yt:videoId>(.*?)<'), 'title': html.unescape(g(r'<title>(.*?)</title>')), 'published': g(r'<published>(.*?)<')[:10], 'views': int(g(r'views="(\d+)"') or 0)})
    return out


def main():
    old = json.load(open(OUT, encoding='utf-8')) if os.path.exists(OUT) else {}
    data = dict(old)
    problems = []

    def attempt(name, fn):
        try:
            data[name] = fn()
        except Exception as ex:  # keep the last good value
            problems.append(f'{name}: {type(ex).__name__}: {ex}')

    def tiffin():
        plates = []
        trailer = None
        for v in yt_feed('https://www.youtube.com/feeds/videos.xml?playlist_id=' + PLAYLISTS['tiffin']):
            m = re.search(r'தட்டு\s*(\d+)', v['title'])
            head = re.split(r'\s*\|\s*', v['title'])[0].strip()
            if m:
                plates.append({'n': int(m.group(1)), 'id': v['id'], 'title': head, 'published': v['published'], 'views': v['views']})
            else:
                trailer = {'id': v['id'], 'title': head}
        plates.sort(key=lambda p: p['n'])
        return {'total': 16, 'plates': plates, 'trailer': trailer}

    def paavam():
        eps = []
        for v in yt_feed('https://www.youtube.com/feeds/videos.xml?playlist_id=' + PLAYLISTS['paavam']):
            m = re.search(r'Ep\.?\s*(\d+)', v['title'])
            if m:
                eps.append({'n': int(m.group(1)), 'id': v['id'], 'title': re.split(r'\s*\|\s*', v['title'])[0].strip(), 'published': v['published']})
        eps.sort(key=lambda p: p['n'])
        return {'episodes': eps}

    def latest():
        return yt_feed('https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL)[:8]

    def medium():
        out = []
        for it in re.findall(r'<item>(.*?)</item>', get(MEDIUM), re.S):
            cd = lambda s: s.replace('<![CDATA[', '').replace(']]>', '')
            title = html.unescape(cd(re.search(r'<title>(.*?)</title>', it, re.S).group(1)))
            link = re.search(r'<link>(.*?)</link>', it, re.S).group(1).split('?')[0]
            date = datetime.datetime.strptime(re.search(r'<pubDate>(.*?)</pubDate>', it).group(1)[5:16], '%d %b %Y')
            body = re.search(r'<content:encoded>(.*?)</content:encoded>', it, re.S)
            text = re.sub(r'<[^>]+>', ' ', html.unescape(cd(body.group(1)))) if body else ''
            img = re.search(r'<img[^>]+src="https://cdn-images-1\.medium\.com/max/\d+/([^"]+)"', it)
            first = re.search(r'<h4[^>]*>(.*?)</h4>|<p[^>]*>(.*?)</p>', cd(body.group(1)) if body else '', re.S)
            blurb = html.unescape(re.sub(r'<[^>]+>', '', (first.group(1) or first.group(2)) if first else '')).strip()
            out.append({'title': title, 'link': link, 'date': date.strftime('%b %Y'), 'minutes': max(1, round(len(text.split()) / 230)),
                        'image': f'https://miro.medium.com/v2/resize:fit:900/format:jpeg/{img.group(1)}' if img else '', 'blurb': blurb[:220]})
        return out

    def channel():
        key = os.environ.get('YT_API_KEY')
        if key:
            st = json.loads(get(f'https://www.googleapis.com/youtube/v3/channels?part=statistics&id={CHANNEL}&key={key}'))['items'][0]['statistics']
            n = int(st['subscriberCount'])
            subs = f'{n / 1000:.1f}K'.replace('.0K', 'K') if n >= 1000 else str(n)
            return {'subscribers': subs, 'videos': int(st['videoCount']), 'source': 'YouTube Data API'}
        page = get(f'https://www.youtube.com/@{HANDLE}')
        m = re.search(r'"([\d.]+[KM]?) subscribers".{0,600}?"([\d,]+) videos"', page, re.S)   # the two counts sit together in the header
        if not m:
            raise ValueError('the channel page no longer shows the counts in the form expected; set YT_API_KEY')
        return {'subscribers': m.group(1), 'videos': int(m.group(2).replace(',', '')), 'source': 'channel page'}

    for name, fn in [('tiffin', tiffin), ('paavam', paavam), ('latest', latest), ('medium', medium), ('channel', channel)]:
        attempt(name, fn)
    data['updated'] = datetime.date.today().isoformat()
    data['problems'] = problems
    json.dump(data, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    t = data.get('tiffin', {})
    print(f"data.json written: {len(t.get('plates', []))} of {t.get('total', '?')} plates, {len(data.get('paavam', {}).get('episodes', []))} Paavam episodes, "
          f"{len(data.get('medium', []))} essays, channel {data.get('channel')}")
    for p in problems:
        print('  PROBLEM', p)
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
