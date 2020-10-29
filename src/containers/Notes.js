import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { contextType } from "react-bootstrap/lib/Col";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./Notes.css";

const Notes = () => {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadNote = () => API.get("notes", `/notes/${id}`);

  const saveNote = (note) =>
    API.put("notes", `/notes/${id}`, {
      body: note,
    });

  const deleteNote = () => API.del("notes", `/notes/${id}`);

  const onLoad = async () => {
    try {
      const note = await loadNote();
      const { content, attachment } = note;

      if (attachment) {
        note.attachmentUrl = await Storage.value.get(attachment);
      }

      setContent(content);
      setNote(note);
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    onLoad();
  }, [id]);

  const validateForm = () => contextType.length > 0;

  const formatFilename = (str) => str.replace(/^\w+-/, "");

  const handleFileChange = (event) => (file.current = event.target.files[0]);

  const handleSubmit = async (event) => {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );

      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });

      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      history.push("/");
    } catch(e) {
      onError(e);
      setIsDeleting(false);
    }
  };

  return (
    <div className="Notes">
      {note && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>
          {note.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
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
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bstyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
};

export default Notes;
