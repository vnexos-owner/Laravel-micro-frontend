"use client";

import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import { Logo } from "../icons";
import Overlay from "../overlay";

import { SignInBody, useSigninMutation } from "@/store/queries/auth";
import { signin } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";

function SignInForm({
  onClose,
  setLoading,
}: {
  onClose: () => unknown;
  setLoading: (value: boolean) => unknown;
}) {
  const dispatch = useAppDispatch();

  const [signIn, { isLoading }] = useSigninMutation();
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget as HTMLFormElement);

      const body: SignInBody = {
        account: formData.get("account") as string,
        password: formData.get("password") as string,
      };

      try {
        const data = await signIn(body).unwrap();

        toast("Đăng nhập thành công!", { variant: "success" });
        dispatch(
          signin({
            refreshToken: data.refresh_token,
            accessToken: data.access_token,
            expiredInSeconds: data.expires_in,
          }),
        );
        onClose();
      } catch {
        toast("Đăng nhập thất bại! Vui lòng thử lại!", { variant: "warning" });
      }
    },
    [errors, setErrors],
  );

  return (
    <Modal.Body>
      <Form
        className="w-full flex flex-col gap-4 px-5 mt-7"
        validationErrors={errors}
        onSubmit={onSubmit}
      >
        <TextField
          isRequired
          isDisabled={isLoading}
          name="account"
          type="account"
        >
          <Label>Tài khoản</Label>
          <Input
            className="rounded-3xl"
            placeholder="Địa chỉ Email hoặc tên đăng nhập"
          />
          <FieldError />
        </TextField>
        <TextField
          isRequired
          isDisabled={isLoading}
          minLength={8}
          name="password"
          type="password"
        >
          <Label>Mật khẩu</Label>
          <Input className="rounded-3xl" placeholder="Mật khẩu" />
          <FieldError />
        </TextField>

        <Button
          className="w-full uppercase my-1"
          isDisabled={isLoading}
          type="submit"
        >
          Xác nhận
        </Button>
      </Form>
      {isLoading && <Overlay />}
    </Modal.Body>
  );
}

function SignInModal() {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Modal>
      <Button variant="outline" onClick={() => setOpen(!isOpen)}>
        Đăng nhập
      </Button>
      <Modal.Backdrop
        isKeyboardDismissDisabled={!!isLoading}
        isOpen={isOpen}
        shouldCloseOnInteractOutside={() => !isLoading}
        variant="blur"
        onOpenChange={setOpen}
      >
        <Modal.Container size="lg">
          <Modal.Dialog className="sm:max-w-[400px]">
            <Modal.CloseTrigger />
            <Modal.Header className="flex flex-col items-center gap-0">
              <Logo width={100} />
              <Modal.Heading className="text-3xl">ĐĂNG NHẬP</Modal.Heading>
            </Modal.Header>
            <SignInForm
              setLoading={setIsLoading}
              onClose={() => setOpen(false)}
            />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default SignInModal;
