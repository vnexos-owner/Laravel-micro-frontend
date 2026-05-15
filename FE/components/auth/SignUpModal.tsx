"use client";

import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  toast,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Logo } from "../icons";
import Overlay from "../overlay";

import { SignUpBody, useSignupMutation } from "@/store/queries/auth";
import { signin } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";

interface GenderModalProps {
  isCustomGenderModalOpen: boolean;
  setIsCustomGenderModalOpen: (value: boolean) => unknown;
  customGender: string;
  setCustomGender: (value: string) => unknown;
  setGender: (value: string) => unknown;
}
function GenderModal({
  customGender,
  setCustomGender,
  isCustomGenderModalOpen,
  setIsCustomGenderModalOpen,
  setGender,
}: GenderModalProps) {
  const [customGenderInput, setCustomGenderInput] =
    useState<string>(customGender);

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      var formData = new FormData(e.target);
      var data = formData.get("customGender") as string | undefined;

      if (data?.trim()) {
        setCustomGender(data.trim());
        setGender("Khác");
        setIsCustomGenderModalOpen(false);
      }
    },
    [customGender],
  );

  return (
    <Modal.Backdrop
      isOpen={isCustomGenderModalOpen}
      variant="opaque"
      onOpenChange={setIsCustomGenderModalOpen}
    >
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>Nhập giới tính</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Form
              className="flex flex-col gap-4 px-5 pt-1.5"
              onSubmit={handleSubmit}
            >
              <TextField
                isRequired
                aria-label="Giới tính khác"
                name="customGender"
              >
                <Input
                  className="rounded-3xl"
                  placeholder="Nhập giới tính của bạn"
                  value={customGenderInput}
                  onChange={(e) => setCustomGenderInput(e.target.value)}
                />
                <FieldError />
              </TextField>
              <Modal.Footer>
                <div className="flex gap-2 w-full">
                  <Button
                    className="flex-1"
                    type="button"
                    variant="outline"
                    onPress={() => {
                      // Revert to empty if they cancel without ever setting a value
                      if (!customGender) setGender("");
                      setIsCustomGenderModalOpen(false);
                    }}
                  >
                    Huỷ
                  </Button>
                  <Button className="flex-1 uppercase" type="submit">
                    Xác nhận
                  </Button>
                </div>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function SignUpForm({
  onClose,
  setLoading,
}: {
  onClose: () => unknown;
  setLoading: (value: boolean) => unknown;
}) {
  const [gender, setGender] = useState<string>("");
  const [customGender, setCustomGender] = useState<string | undefined>(
    undefined,
  );

  const [isCustomGenderModalOpen, setIsCustomGenderModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const [signup, { isLoading }] = useSignupMutation();
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget as HTMLFormElement);

      const body: SignUpBody = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        password_confirmation: formData.get("password_confirmation") as string,
        gender: formData.get("gender") as string,
        dob: formData.get("dob") as string,
      };

      try {
        const data = await signup(body).unwrap();

        toast("Đăng ký thành công!", { variant: "success" });
        dispatch(
          signin({
            refreshToken: data.refresh_token,
            accessToken: data.access_token,
            expiredInSeconds: data.expires_in,
          }),
        );
        onClose();
      } catch (err: any) {
        const res = err.data.errors;
        let data: any = {};

        Object.keys(res).forEach((v) => (data[v] = res[v][0]));

        setErrors(data);
        toast("Đăng ký thất bại!", { variant: "warning" });
      }
    },
    [errors, setErrors],
  );

  const cachedGenderModal = useMemo(
    () => (
      <GenderModal
        customGender={gender}
        isCustomGenderModalOpen={isCustomGenderModalOpen}
        setCustomGender={setCustomGender}
        setGender={setGender}
        setIsCustomGenderModalOpen={setIsCustomGenderModalOpen}
      />
    ),
    [
      gender,
      isCustomGenderModalOpen,
      setCustomGender,
      setGender,
      setIsCustomGenderModalOpen,
    ],
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
          name="name"
          type="fullname"
        >
          <Label>Họ và Tên</Label>
          <Input className="rounded-3xl" placeholder="Họ và tên" />
          <FieldError />
        </TextField>
        <TextField isRequired isDisabled={isLoading} name="email" type="email">
          <Label>Địa chỉ Email</Label>
          <Input className="rounded-3xl" placeholder="Email" />
          <FieldError />
        </TextField>
        <TextField
          isRequired
          isDisabled={isLoading}
          name="username"
          type="username"
          validate={(value) => {
            if (!/^[a-zA-Z0-9_]{6,}$/u.test(value))
              return "Tên đăng nhập không hợp lệ.";

            return null;
          }}
        >
          <Label>Tên đăng nhập</Label>
          <Input className="rounded-3xl" placeholder="Tên đăng nhập" />
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
        <TextField
          isRequired
          isDisabled={isLoading}
          minLength={8}
          name="password_confirmation"
          type="password"
        >
          <Label>Nhập lại mật khẩu</Label>
          <Input className="rounded-3xl" placeholder="Nhập lại mật khẩu" />
          <FieldError />
        </TextField>
        <DatePicker
          isRequired
          className="w-full"
          isDisabled={isLoading}
          name="dob"
        >
          <Label>Ngày sinh</Label>
          <DateField.Group fullWidth className="rounded-4xl">
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DatePicker.Trigger>
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DatePicker.Popover>
            <Calendar aria-label="Event date">
              <Calendar.Header>
                <Calendar.YearPickerTrigger>
                  <Calendar.YearPickerTriggerHeading />
                  <Calendar.YearPickerTriggerIndicator />
                </Calendar.YearPickerTrigger>
                <Calendar.NavButton slot="previous" />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(date) => <Calendar.Cell date={date} />}
                </Calendar.GridBody>
              </Calendar.Grid>
              <Calendar.YearPickerGrid>
                <Calendar.YearPickerGridBody>
                  {({ year }) => <Calendar.YearPickerCell year={year} />}
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
          </DatePicker.Popover>
          <FieldError />
        </DatePicker>
        <>
          <input
            name="gender"
            type="hidden"
            value={gender === "Khác" ? (customGender ?? "") : gender}
          />
          <RadioGroup
            isRequired
            className="flex flex-col gap2"
            isDisabled={isLoading}
            value={gender}
            onChange={(value) => {
              setGender(value);
              if (value === "Khác" && !customGender)
                setIsCustomGenderModalOpen(true);
            }}
          >
            <Label>Giới tính</Label>
            <div className="flex gap-4 pl-2">
              <Radio value="Nam">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content className="text-foreground">Nam</Radio.Content>
              </Radio>
              <Radio value="Nữ">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content className="text-foreground">Nữ</Radio.Content>
              </Radio>
              <Radio value="Khác">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content className="text-foreground flex">
                  <div>{customGender ?? "Khác"}</div>
                </Radio.Content>
              </Radio>
            </div>
            <FieldError />
          </RadioGroup>
          {gender === "Khác" && customGender && (
            <Button
              className="t-0.5"
              isDisabled={isLoading}
              type="button"
              variant="secondary"
              onClick={() => setIsCustomGenderModalOpen(true)}
            >
              Thay đổi
            </Button>
          )}
        </>

        <Button
          className="w-full uppercase mb-1"
          isDisabled={isLoading}
          type="submit"
        >
          Xác nhận
        </Button>
      </Form>
      {cachedGenderModal}
      {isLoading && <Overlay />}
    </Modal.Body>
  );
}

function SignUpModal() {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Modal>
      <Button variant="primary" onClick={() => setOpen(!isOpen)}>
        Đăng ký
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
              <Modal.Heading className="text-3xl">ĐĂNG KÝ</Modal.Heading>
            </Modal.Header>
            <SignUpForm
              setLoading={setIsLoading}
              onClose={() => setOpen(false)}
            />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default SignUpModal;
