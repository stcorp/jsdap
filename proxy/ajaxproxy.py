"""AJAX proxy based on paste.proxy.

Allows requests to any host. Necessary for cross-domain XHR, unless
we're using Greasemonkey.
"""

__author__ = 'Roberto De Almeida <roberto@dealmeida.net>'
__version__ = '1.0.0'
__license__ = 'MIT'

import urllib
import urlparse

from paste.proxy import TransparentProxy


def make_ajax_proxy(global_conf):
    return AjaxProxy


def AjaxProxy(environ, start_response):
    address = environ['PATH_INFO']
    address = urllib.unquote(address)
    if address.startswith('/'): address = address[1:]

    scheme, netloc, path, queries, fragment = urlparse.urlsplit(address)
    environ['wsgi.url_scheme'] = scheme
    environ['HTTP_HOST'] = netloc
    environ['SCRIPT_NAME'] = ''
    environ['PATH_INFO'] = path
    environ['QUERY_STRING'] = queries
    environ['HTTP_CONTENT_TYPE'] = "application/binary"

    p = TransparentProxy()
    return p(environ, start_response)
