import { Formik, Form, Field, FieldProps } from 'formik';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Segment, Header, Comment, Button, Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
  const { commentStore } = useStore();

  useEffect(() => {
    if (activityId) {
      commentStore.createHubConnection(activityId);
    }
    return () => {
      commentStore.clearComments();
    };
  }, [commentStore, activityId]);

  const validationScheme = yup.object({
    body: yup.string().required('This field is required'),
  });

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
      <Formik
            onSubmit={(values, { resetForm }) =>
              commentStore.addComment(values).then(() => resetForm())
            }
            initialValues={{ body: '' }}
            validationSchema={validationScheme}
          >
            {({ isSubmitting, isValid, handleSubmit }) => (
              <Form className="ui form">
                <Field name='body'>
                  {(props: FieldProps) => (
                    <div style={{position: 'relative'}}>
                      <Loader active={isSubmitting}/>
                      <textarea
                        placeholder='enter your comment (Enter to submit, SHIFT + enter for a new line)'
                        rows={2}
                        {...props.field}
                        onKeyPress={e => {
                          if (e.key === 'Enter' && e.shiftKey) {
                            return
                          }
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            isValid && handleSubmit()
                          }
                        }}
                      />
                      
                    </div>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        <Comment.Group>
          {commentStore.comments && commentStore.comments.length > 0 ? (
            commentStore.comments.map((comment) => (
              <Comment key={comment.id}>
                <Comment.Avatar
                  src={comment.image || '/assets/user.png'}
                  as={Link}
                  to={`/profiles/${comment.username}`}
                />
                <Comment.Content>
                  <Comment.Author as="a">{comment.displayName}</Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistanceToNow(comment.createdAt) + ' ago'}</div>
                  </Comment.Metadata>
                  <Comment.Text style={{whiteSpace: 'pre-wrap'}}>
                    {comment.body}
                  </Comment.Text>
                  <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            ))
          ) : (
            <h1>Be the first one to comment!</h1>
          )}

         
        </Comment.Group>
      </Segment>
    </>
  );
});
