"""AJAX proxy based on paste.proxy.

Allows only for GET requests, but to any host. Necessary for
cross-domain XHR, unless we're using Greasemonkey.
"""

__author__ = 'Roberto De Almeida <roberto@dealmeida.net>'
__version__ = '1.0.0'
__license__ = 'MIT'

import urllib

from paste.proxy import Proxy


def make_ajax_proxy(global_conf, *args, **kwargs):
    return AjaxProxy


def AjaxProxy(environ, start_response):
    address = environ['PATH_INFO']
    address = urllib.unquote(address)
    if address.startswith('/'): address = address[1:]
    environ['PATH_INFO'] = '/'

    p = Proxy(address, allowed_request_methods=['GET'])
    return p(environ, start_response)

