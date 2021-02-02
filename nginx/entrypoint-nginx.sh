#!/bin/bash

vars=$(compgen -A variable)
subst=$(printf '${%s} ' $vars)
envsubst "$subst" < /etc/nginx/conf.d/default.conf | sponge /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'