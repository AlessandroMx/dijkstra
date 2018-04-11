import os
import os.path
import random
import string

import cherrypy


class WebPage(object):
    @cherrypy.expose
    def index(self):
        return open('./public/index.html')
    
@cherrypy.expose
class WebPageWebService(object):

    @cherrypy.tools.accept(media='text/plain')
    def GET(self):
        return "cherrypy.session['mystring']"


if __name__ == '__main__':
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/generator': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'text/plain')],
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './public'
        }
    }
    webapp = WebPage()
    webapp.generator = WebPageWebService()
    cherrypy.quickstart(webapp, '/', conf)
