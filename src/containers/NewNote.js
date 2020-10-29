import React, { useRef, useState } from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import './NewNote.css';
import { onError } from '../libs/errorLib';
import { API } from 'aws-amplify';
import { s3Upload } from '../libs/awsLib';

const NewNote = () => {
  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => content.length > 0;

  const handleFileChange = (event) => {
    file.current = event.target.files[0];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file.current &&
      file.current.size > config.MAX_ATTACHMENT_SIZE) {
        alert(
          `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000 } MB.`
        );

        return;
      }

      setIsLoading(true);

      try {
        const attachment = file.current ? await s3Upload(file.current) : null;
        
        await createNote({ content, attachment });
        history.push('/');
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
  };

  const createNote = (note) => API.post("notes", "/notes", {
    body: note
  });

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <FormControl 
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}

export default NewNote;