export default {
	'$schema': 'http://json-schema.org/draft-04/schema#',
	'id': '/user',
	'title': 'User',
	'description': 'A user',
	'type': 'object',
	'properties': {
		'name': {
			'description': 'User name',
			'type': 'string'
		},
		'email': {
			'description': 'User email',
			'type': 'string'
		},
		'password': {
			'description': 'User password',
			'type': 'string'
		},
		'address': {
			'description': 'User address',
			'type': 'string'
		}
	},
	'required': ['email','password']
};
