import json
import os
import os.path
import random
import string

import cherrypy
import cherrypy_cors

import dijkstra
import graphs


class WebPage(object):
    @cherrypy.expose
    def index(self):
        return open('./public/index.html')


@cherrypy.expose
class WebPageWebService(object):

    @cherrypy.tools.accept(media='text/plain')
    def GET(self, data):
        listRes = dijkstra.Dijkstra.find_all_paths({ 'a': {'b': 10, 'c': 5}, 'b': {'c': 6} }, 'a', 'c')
        return str(listRes)

    def POST(self, data_json, source, end):
        data = json.loads(data_json)
        # listRes = dijkstra.Dijkstra.find_all_paths(data, source, end)
        g = {}
        for d in data:
            tmpKeys = list(data[d].keys())
            g[d] = tmpKeys
        print(g)
        graph = graphs.Graph(g)

        print("Vertices of graph:")
        print(graph.vertices())

        print("Edges of graph:")
        print(graph.edges())

        print('All paths from vertex "a" to vertex "b":')
        path = graph.find_all_paths(source, end)
        print(path)
        return json.dumps(path, ensure_ascii=False)
        # return 'x'


if __name__ == '__main__':
    cherrypy_cors.install()
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/dijkstra': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'text/plain')],
            'cors.expose.on': True
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './public'
        }
    }
    webapp = WebPage()
    webapp.dijkstra = WebPageWebService()
    cherrypy.quickstart(webapp, '/', conf)
