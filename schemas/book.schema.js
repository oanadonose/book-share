export default {
	'$schema': 'http://json-schema.org/draft-04/schema#',
	'id': '/books',
	'title': 'Book',
	'description': 'A book uploaded by a user',
	'type': 'object',
	'properties': {
		'title': {
			'description': 'The title of the book',
			'type': 'string'
		},
		'author': {
			'description': 'The author of the book',
			'type': 'string'
		},
		'ISBN': {
			'description': 'The International Standard Book Number',
			'type': 'string'
		},
		'photo': {
			'description': 'A main image for the book',
			'type': 'uri'
		},
		'genre': {
			'description': 'Describes the genre of the book',
			'type': 'string'
		},
	},
	'required': ['title','author']
};
